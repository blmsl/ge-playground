import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { DbServiceService } from './db-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private activeUserId: string;

  constructor(
    private db: DbServiceService
    ) {}

  setActiveUserId(id) {
    this.activeUserId = id;
  }
  
  getActiveUserId() {
    return this.activeUserId;
  }
}
