import { pool } from '../../db/connectPostgre.repository'
import { AppError } from '../../util/AppError'

// user owner
export const getMyPromoCodeUsageService = async (loginUserId: number) => {
    const response = await pool.query(`
    select * from 
    promo_code_usage where user_id = $1
    order by created_at desc
    `, [loginUserId])

    return response.rows
}

// user route
export const redeemPromoCodeService = async (code: string, loginUserId: number) => {
    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // lock promo row กัน race condition
        const promoResult = await client.query(`
            select * from 
            promo_code
            where code = $1
            for update
            `, [code])

        const promoCount = promoResult.rowCount ?? 0

        if (promoCount === 0) {
            throw new AppError("Promo code not found", 400)
        }

        const promo = promoResult.rows[0]

        // check is_active
        if (!promo.is_active) {
            throw new AppError("Promo code inactive", 400)
        }

        // check usage limit
        if (promo.max_usage && promo.usage_count >= promo.max_usage) {
            throw new AppError("Promo code fully redeemed", 400)
        }

        // check exist User
        const exisitingUsage = await client.query(`
            select id 
            from promo_code_usage 
            where promo_code_id = $1
            and user_id = $2
            `, [promo.id, loginUserId]
        )

        if ((exisitingUsage.rowCount ?? 0) > 0) {
            throw new AppError("You already redeem this promo code", 400)
        }

        // insert pro-code-usage snapshot
        await client.query(`
            insert into promo_code_usage
            (promo_code_id ,  user_id ,points, used_at)
            values($1,$2,$3,now())
        `, [promo.id, loginUserId, promo.bonus_points])

        // update promo usage_count
        await client.query(`
            update promo_code
            set usage_count = usage_count + 1
            where id = $1
            `, [promo.id])

        // update user points
        await client.query(`
            update users
            set points = points + $1
            where id = $2
            `, [promo.bonus_points, loginUserId])

        // insert points_histories
        await client.query(`
            insert into points_histories
            (user_id , points , points_source , reference_id , created_at)
            values($1,$2,'promo_bonus' , $3, now())
            `, [loginUserId, promo.bonus_points, promo.id])

        await client.query("COMMIT")

        return {
            message: "Promo code redeemed Successfully",
            earned_points: promo.bonus_points
        }
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}

// admin route
export const getAllRedeemedPromoCodeusagesService = async () => {
    const response = await pool.query(`
        select * from promo_code_usage order by created_at desc
        `)

    return response.rows
}

// admin route
export const getRedeemedPromoCodeusagesByIdService = async (id: number) => {
    const response = await pool.query(`
        select * from promo_code_usage where id = $1
        `, [id])

    if (response.rowCount === 0) {
        throw new AppError("Promo code usage not found", 400)
    }

    return response.rows[0]
}