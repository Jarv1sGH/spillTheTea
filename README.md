
# Install Dependencies

**For Backend** - `npm i`

**For Frontend** - `cd frontend` ` npm i`

## Env Variables
You will need to create a config.env file and add these variables in order to run this project.

PORT,
DB_URI ,
JWT_SECRET,
JWT_EXPIRE,
COOKIE_EXPIRE,
SMPT_SERVICE ,
SMPT_MAIL,
SMPT_PASSWORD,
SMPT_HOST,
SMPT_PORT,
CLOUDINARY_NAME,
CLOUDINARY_API_KEY,
CLOUDINARY_API_SECRET,

Currently Real time messages are not working on the deployment because vercel does not
support websocket connections, It works if you run the project locally.

Change the ENDPOINT in ChatRoom.js to,
const ENDPOINT = "http://localhost:4000" if you want to run it locally.