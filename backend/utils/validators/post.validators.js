const zod = require("zod")


const postValidator = zod.object({
    text: zod.string().max(200).optional(),
    img: zod.string().optional(),
    link: zod.string().optional()
})

const idValidator = zod.object({
  id: zod.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId").min(6),
});

module.exports = {postValidator, idValidator}