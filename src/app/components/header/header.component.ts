import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription, tap } from 'rxjs';
import { IUser } from 'src/app/models/IUser';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductsService } from 'src/app/services/products.service';
import { StateService } from 'src/app/services/state.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  constructor(
    public usersService: UserService,
    public productsService: ProductsService,
    public categoriesService: CategoriesService,
    public stateService: StateService,
    public formBuilder: FormBuilder,
    public router: Router
  ) {
  }
  ngOnDestroy(): void {
    this.subscriptionArray.forEach((subscription) => {
      subscription.unsubscribe();
    })
    this.subscriptionArray = [];
  }
  
  ngOnInit(): void {
    this.searchControl = this.formBuilder.control("");

    let userSubscription = this.usersService.followCurrentUser().subscribe((newUser) => {
      this.currentUser = newUser;
    })
    
    let categorySubscription = this.categoriesService.followActiveCategorySubject().subscribe((newCategory) => {
      if (newCategory != 0) {
        //Clears the search input value, when the user changes categories in the store.
        this.searchControl.setValue('');
      }
    })
    
    this.searchObservable = this.searchControl.valueChanges;
    let searchSubscribe = this.searchObservable.subscribe((searchValue) => {
      // When the user tries to search a product, this line changes the categories at the store to "All" category.
      this.categoriesService.setActiveCategory(0);
      if (searchValue) {
        this.productsService.searchProduct(searchValue);
      }
    })

    this.subscriptionArray.push(userSubscription, categorySubscription, searchSubscribe);
  }

  currentUser: IUser;
  searchControl: FormControl;
  searchObservable: Observable<any>;
  subscriptionArray: Subscription[] = [];

  handleLogout = () => {
    this.usersService.setCurrentUser(null);
    sessionStorage.removeItem("userData");
  }

  handleHome = () => {
    if (this.currentUser) {
      this.router.navigate(['home']);
    }
    else {
      this.router.navigate(['/home/login']);
    }
  }

  clearSearchInput = () => {
    this.searchControl.setValue('');
  }

}
