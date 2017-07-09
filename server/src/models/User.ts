import * as bcrypt from 'bcrypt-nodejs';
import * as crypto from 'crypto';
import bluebird = require('bluebird');
import thinky = require('thinky');

const { r, type } = thinky();

export interface UserAttributes {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
}

export interface UserDocument extends UserAttributes, thinky.Document<UserDocument, UserModel, UserAttributes> {
    name(): string;
    comparePassword: (candidatePassword: string, cb: (err: Error, isMatch: boolean) => void) => void;
}

export interface UserModel extends thinky.Model<UserDocument, UserModel, UserAttributes> {
    findByEmail(email: string): bluebird.Thenable<UserDocument>;
}

export const User = thinky().createModel<UserDocument, UserModel, UserAttributes>('users', {
    id: type.string(),
    firstName: type.string().required(),
    lastName: type.string().required(),
    email: type.string().email().required(),
    password: type.string().required(),
    passwordResetToken: type.string().optional(),
    passwordResetExpires: type.date().optional()
}, {});

// Indexes
User.ensureIndex('id');
User.ensureIndex('email');

User.pre('save', function (next) {
    const user = this;

    // TODO check if password has changed
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, undefined, (err: Error, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

// Static Methods

function findByEmail(email: string): bluebird.Thenable<UserDocument> {
    return User.filter({ email: email })
        .nth(0)
        .default(null)
        .run();
}

User.defineStatic('findByEmail', findByEmail);

// Methods

function name(): string {
    const self: UserDocument = this;
    return `${self.firstName} ${self.lastName}`.trim();
}

function comparePassword(candidatePassword: string, cb: (err: Error, isMatch: any) => {}) {
    bcrypt.compare(candidatePassword, this.password, (err: Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
}

User.define('name', name);
User.define('comparePassword', comparePassword);

