import sql from "../configs/db.js"

export const getUserCreations = async (req, res) => {

    try {
        const { userID } = req.auth()

        const creation = await sql`SELECT * FROM creations WHERE user_id = $ {userId} ORDER BY created_at DESC`;

        res.json({ success: true, creation });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}



export const getPublishedCreations = async (req, res) => {

    try {
        const { userID } = req.auth()

        const creation = await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;

        res.json({ success: true, creation });

    } catch (error) {
        res.json({ success: false, message: error, message });
    }
}




export const toggleLikeCreation = async (req, res) => {

    try {
        const { userID } = req.auth()
        const {id} = req.body

    
        const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;

        if(!creation){
            return res.json({ success: false, message: "Creation not found"})
        }

        const currentLikes = creation.like;
        const userIdstr = userID.toString()
        let updatedLikes;
        let message;


        if(currentLikes.includes(userIdstr)) {
            updatedLikes = currentLikes.filter((user)=>user !== userIdstr)
            message = 'Creation Unliked'
        }else{
            updatedLikes = [...currentLikes, userIdstr]
            message = 'Creation Liked'
        }

        const formattedArray =`{${updatedLikes.join(',')}}`

        await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;

        res.json({ success: true, creation });

    } catch (error) {
        res.json({ success: false, message: error, message });
    }
}