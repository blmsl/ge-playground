import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbServiceService } from '../../../services/db-service.service';
import { Observable } from 'rxjs';
import { Exchange } from '../../../models/exchange.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-exchange-view',
  templateUrl: './exchange-view.component.html',
  styleUrls: ['./exchange-view.component.scss']
})
export class ExchangeViewComponent implements OnInit {

  public exchange: Observable<Exchange>;
  public people: Observable<any>;
  public currentUser: User;
  public isAdmin: boolean;
  public participant: boolean;
  private exchangeId: string;
  private curentUserId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: DbServiceService,
    private userSrv: UserService,
  ) {
    
  }

  async ngOnInit() {
    this.route.parent.params.subscribe(async params => {
      this.exchangeId = params['exchangeId'];
      this.userSrv.setActiveUserId(params['curentUserId']);
      this.curentUserId = this.userSrv.getActiveUserId();
      await this.loadExchange();
      await this.loadPeople();
      await this.db.getExchangee(this.exchangeId, this.userSrv.getActiveUserId()).subscribe(async user => {
        if (user) {
          this.currentUser = await user;
          this.isAdmin = (this.currentUser.isAdmin == 'true') || false;
          this.participant = true;
        } else {
          this.exchange.subscribe(async exchange => {
            if (!exchange.includeAdmin && this.curentUserId === exchange.adminUid) {
              this.currentUser = {name: exchange.adminName}
              this.isAdmin = true;
              this.participant = false;
            }
          })
        }
      });

    });
  }

  async loadExchange() {
    // load data from firestore for this exhange
    this.exchange = await this.db.getExchange(this.exchangeId);
  }

  loadPeople() {
    this.people = this.db.getExchangePeople(this.exchangeId);
  }

  loadExchangeAs(id) {
    this.router.navigate(['/exchange/' + this.exchangeId + '/' + id]);
  }

  viewed(viewed: boolean) {
    return viewed ? "<span class='text-success'>Yes</span>" : "<span class='text-danger'>No</span>"
  }

}
