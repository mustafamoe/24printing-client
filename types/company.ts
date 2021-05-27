import { IUser } from "./user";

export interface ICompany {
    company_id: string;
    company_name: string;
    company_email: string;
    trade_license: string;
    company_tel_number: number;
    fax_number: number;
    website: string;
    contact_name: string;
    contact_direct_number: number;
    contact_mobile_number: number;
    employees: IUser[];
    contact_email: string;
}
