import { Request, Response, NextFunction } from 'express';

export const parseProductBody = (req: Request, res: Response, next: NextFunction) => {
    // Parse price to number
    if (req.body.price) {
        req.body.price = Number(req.body.price);
    }

    // Parse specs values
    if (req.body.specs && typeof req.body.specs === 'object') {
        Object.keys(req.body.specs).forEach(key => {
            const value = req.body.specs[key];
            if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
                req.body.specs[key] = Number(value);
            }
        });
    }

    next();
};