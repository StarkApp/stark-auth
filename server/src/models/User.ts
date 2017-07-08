import * as bcrypt from 'bcrypt-nodejs';
import * as crypto from 'crypto';
import bluebird = require('bluebird');
import thinky = require('thinky');

const { r, type } = thinky();

export interface UserAttributes {
    identity?: string;
    email: string;
    password: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
}

export interface UserDocument extends UserAttributes, thinky.Document<UserDocument, UserModel, UserAttributes> {
    // To do - regular method declarations
}

export interface UserModel extends thinky.Model<UserDocument, UserModel, UserAttributes> {
    findByIdentity(identity: string): bluebird.Thenable<UserDocument>;
}

export const User = thinky().createModel('users', {
    identity: type.string().required(),
    email: type.string().email().required(),
    password: type.string().required(),
    passwordResetToken: type.string().optional(),
    passwordResetExpires: type.date().optional()
}, {});

// Indexes
User.ensureIndex('identity');

// Static Methods
function findByIdentity(identity: string): bluebird.Thenable<UserDocument> {
    return User.getAll(identity, { index: 'identity' }).nth(0).run();
}

User.defineStatic('findByIdentity', findByIdentity);

// To do - regular methods User.define('name', function() {});
