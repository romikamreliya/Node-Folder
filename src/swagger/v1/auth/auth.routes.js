/**
 * @swagger
 * /api/v1/user/add:
 *   post:
 *     description: Create a new public token.
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: jons
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jons@gmail.com
 *               phone:
 *                 type: string
 *                 example: "1234567895"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                  type: string
 *                  example: 200
 *                 message:
 *                   type: string
 *                   example: Token generated successfully
 *                 data: 
 *                    type: object
 *                    properties: 
 *                      id:
 *                        type: number
 *                        example: 1
 *                      name:
 *                        type: string
 *                        example: jons
 *                      email:
 *                        type: string
 *                        example: jons@gmail.com
 *                      phone:
 *                         type: string
 *                         example: "1234567895"
 *                      status:
 *                         type: string
 *                         example: active
 *                      notes:
 *                         type: string
 *                         example: "This is a note about the user."
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/user/get:
 *   get:
 *     description: Get a User.
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                  type: string
 *                  example: 200
 *                 message:
 *                   type: string
 *                   example: Token generated successfully
 *                 data: 
 *                    type: array
 *                    items:
 *                     type: object
 *                     properties: 
 *                       id:
 *                        type: number
 *                        example: 1
 *                       name:
 *                        type: string
 *                        example: jons
 *                       email:
 *                        type: string
 *                        example: jons@gmail.com
 *                       phone:
 *                         type: string
 *                         example: "1234567895"
 *                       status:
 *                         type: string
 *                         example: active
 *                       notes:
 *                         type: string
 *                         example: "This is a note about the user."
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/user/update:
 *   put:
 *     description: Update an existing user.
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               id:
 *                 type: number
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: jons
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jons@gmail.com
 *               phone:
 *                 type: string
 *                 example: "1234567895"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                  type: string
 *                  example: 200
 *                 message:
 *                   type: string
 *                   example: Token generated successfully
 *                 data: 
 *                    type: object
 *                    properties: 
 *                      id:
 *                        type: number
 *                        example: 1
 *                      name:
 *                        type: string
 *                        example: jons
 *                      email:
 *                        type: string
 *                        example: jons@gmail.com
 *                      phone:
 *                         type: string
 *                         example: "1234567895"
 *                      status:
 *                         type: string
 *                         example: active
 *                      notes:
 *                         type: string
 *                         example: "This is a note about the user."
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /api/v1/user/delete:
 *   delete:
 *     description: Delete an existing user.
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: number
 *                 example: 1
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
