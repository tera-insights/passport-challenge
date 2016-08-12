declare module 'passport-challenge' {

    import passport = require('passport');
    import express = require('express');

    interface IStrategyBase {
        usernameField?: string;
        challengeField?: string;
        signatureField?: string;
    }

    interface IStrategyOptions extends IStrategyBase {
        passReqToCallback?: boolean;
    }

    interface IStrategyOptionsWithRequest extends IStrategyBase {
        passReqToCallback: boolean;
    }

    interface IVerifyOptions {
        message: string;
    }

    interface VerifyFunctionWithRequest {
        (req: express.Request, username: string, challenge: string, signature: string, done: (error: any, user?: any, options?: IVerifyOptions) => void): void;
    }

    interface VerifyFunction {
        (username: string, challenge: string, signature: string, done: (error: any, user?: any, options?: IVerifyOptions) => void): void;
    }

    class Strategy implements passport.Strategy {
        constructor(options: IStrategyOptionsWithRequest, verify: VerifyFunctionWithRequest);
        constructor(options: IStrategyOptions, verify: VerifyFunction);
        constructor(verify: VerifyFunction);

        name: string;
        authenticate: (req: express.Request, options?: Object) => void;
    }
}                          