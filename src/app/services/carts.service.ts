import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICart } from '../models/ICart';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CartsService {

  constructor(private http: HttpClient, private messageService: MessageService) {

  }

  private cart: ICart;
  private cartSubject = new BehaviorSubject<ICart>(null);

  getLastCart = async (): Promise<void> => {
    this.http.get<ICart>('http://localhost:3001/carts').subscribe((cartResponse) => {
      if (cartResponse) {
        this.cart = {
          id: cartResponse.id,
          creationDate: cartResponse.creationDate,
          isOpen: cartResponse.isOpen
        };
        this.cartSubject.next(this.cart);
      }
      else {
        let noLastCartResponse : ICart = {
          id: 0,
          creationDate: null,
          isOpen: false
        }
        this.cartSubject.next(noLastCartResponse);
      }
    }, (e) => {
      this.messageService.add({ key: 'appToast', severity: 'error', summary: 'Server Error', detail: 'Something went wrong, please try again later.' });
      console.log(e);

    })
  }

  openCart = (): void => {
    this.http.post<ICart>('http://localhost:3001/carts', {}).subscribe((cart) => {
      this.cart = cart;
      this.cartSubject.next(this.cart);
    }, (e) => {
      this.messageService.add({ key: 'appToast', severity: 'error', summary: 'Server Error', detail: 'Something went wrong, please try again later.' });
      console.log(e);

    })
  }

  followCartSubject = (): Observable<ICart> => {
    return this.cartSubject.asObservable();
  }

  setCart = (newCart: ICart) => {
    this.cartSubject.next(newCart);
  }

  getCart = () : ICart => {
    return this.cartSubject.value;
  }
}
