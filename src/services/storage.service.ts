import { Injectable } from "@angular/core";
import { STORAGE_KEYS } from "../config/storage_keys.config";
import { LocalUser } from "../models/local_user";
import { Role } from "../models/role";


@Injectable()
export class StorageService {

    getLocalUser(): LocalUser{
        let usr = localStorage.getItem(STORAGE_KEYS.localUser);

        if(usr == null){
            return null;
        }
        else{
            return JSON.parse(usr);
        }
    }

    setLocalUser(obj: LocalUser){

        if(obj == null){
            localStorage.removeItem(STORAGE_KEYS.localUser);
        }
        else{
            localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(obj));
        }

    }

    getRole(): Role{
        let str = localStorage.getItem(STORAGE_KEYS.role);

        if(str == null){
            return null;
        }
        else{
            return JSON.parse(str);
        }
    }

    setRole(obj: Role){

        if(obj == null){
            localStorage.removeItem(STORAGE_KEYS.role);
        }
        else{
            localStorage.setItem(STORAGE_KEYS.role, JSON.stringify(obj));
        }

    }


}