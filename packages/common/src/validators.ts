import { z } from 'zod';

export const EmailSchema = z.string().email();

export const UUIDSchema = z.string().uuid();

export const PositiveNumberSchema = z.number().positive();

export const DateSchema = z.coerce.date();
