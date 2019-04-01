import { User } from './user';

export class Chain {
    public id: number;
    public name: String;
    public created_by: number;
    public initValue: any;
    public users: number[];
    public groups: string[];
}