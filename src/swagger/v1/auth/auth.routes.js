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
 *                      customAccessToken:
 *                        type: string
 *                        example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                      jwtAccessToken:
 *                        type: string
 *                        example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                      customRefreshToken:
 *                        type: string
 *                        example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
