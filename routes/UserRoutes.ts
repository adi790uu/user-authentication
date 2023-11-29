import express from "express"
import { registerUser, authUser } from "../controllers/users";

export const router = express.Router();

// const validateToken = require('../middleware/validateToken');

// const { registerUser, authUser, getUser } = require('../controllers/users');

router.route('/register').post(registerUser);
router.route('/login').post(authUser);

