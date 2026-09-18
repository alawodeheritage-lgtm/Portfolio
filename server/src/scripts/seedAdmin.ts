import 'dotenv/config';
import bcrypt from 'bcrypt';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { AdminModel } from '../models/Admin.js';

const PASSWORD_HASH_ROUNDS = 12;

function readAdminCredentials(): { email: string; password: string } {
	const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
	const password = process.env.ADMIN_PASSWORD;

	if (!email || !password) {
		throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required to seed the admin');
	}

	if (password.length < 8) {
		throw new Error('ADMIN_PASSWORD must be at least 8 characters long');
	}

	return { email, password };
}

async function seedAdmin(): Promise<void> {
	const { email, password } = readAdminCredentials();

	await connectDatabase();

	try {
		const existingAdminCount = await AdminModel.countDocuments();
		if (existingAdminCount > 0) {
			throw new Error('An admin account already exists; refusing to create another');
		}

		const passwordHash = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
		await AdminModel.create({ email, passwordHash });
		console.info('Admin account created successfully');
	} finally {
		await disconnectDatabase();
	}
}

seedAdmin().catch((error: unknown) => {
	console.error('Unable to seed admin account', error);
	process.exitCode = 1;
});