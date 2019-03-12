
export class session_model {
    token: any;
    loginExpiredTime: any;
    userData = new user_session();
}

export class user_session {
    usr_id: number;
    usr_email: string;
    original_branch_id: number;
    original_branch_name: string;
    branch_id: number;
    branch_name: string;
    force_reset: boolean;
    sch_id: number;
    usr_full_nm: string;
    sch_name: string;
    role_code: string;
    userRoles: any[];
    userPermissions: any[];
    selected_sch_id: number;
    sch_logo: any;
}