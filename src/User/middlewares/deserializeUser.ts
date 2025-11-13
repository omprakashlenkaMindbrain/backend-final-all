import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { verifyJwt } from '../../utils/jwt.utils';
import { reIssueAccessToken } from '../services/session.service';


const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  let accessToken = req.cookies.accessToken;
  let refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return next();
  }

  const { decode, expired } = verifyJwt(accessToken);

  if (decode) {
    res.locals.user = decode;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
      });

      const result = verifyJwt(newAccessToken);
      res.locals.user = result.decode;
    }
  }

  return next();
};

export default deserializeUser;