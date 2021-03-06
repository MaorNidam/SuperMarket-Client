import { Injectable } from '@angular/core';
import { CartItemsService } from './cart-items.service';
import { CartsService } from './carts.service';
import { CategoriesService } from './categories.service';
import { OrdersService } from './orders.service';
import { ProductsService } from './products.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private ordersService: OrdersService,
    private usersService: UserService,
    private cartsService: CartsService,
    private cartItemsService: CartItemsService,
  ) {
    // Get all the relevant information on startup.
    this.productsService.getAllProducts();
    this.ordersService.getOrdersAmount();
    this.categoriesService.getAllCategories();

    //get the user info from the session storage.
    let userJson = sessionStorage.getItem("userData");
    if (userJson) {
      let currentUser = JSON.parse(userJson);
      this.usersService.setCurrentUser(currentUser);
    }

    //this subscriptions makes sure that the current user and cart will stay updated when the user refreshes the page.
    this.usersService.followCurrentUser().subscribe((newUser) => {
      if (newUser && newUser.role == 'user') {
        this.cartsService.getLastCart();
        this.ordersService.getLastOrderDate();
      }
      else {
        this.cartsService.setCart(null);
        this.ordersService.lastOrderDate = null;
      }
    });

    this.cartsService.followCartSubject().subscribe((newCart) => {
      if (newCart) {
        // Cart with id 0 means there were no carts for this user at the data base.
        if (newCart?.id == 0 || newCart.isOpen == false) {
          this.cartsService.openCart();
        }
        else {
          this.cartItemsService.getCartItems(newCart.id);
        }
      }
      else {
        this.cartItemsService.setCartItems(null);
      }
    })
  }

  clearSearchInput = () => {
    this.categoriesService.setActiveCategory(1);
    this.categoriesService.setActiveCategory(0);
  }

  //Tells the search input in the header, if the user is at the store component.
  isStore: boolean = false;

  cities: any[] = ['Akko', 'Afula', 'Al Bu??ay???ah', 'Al Khushn??yah', 'Ashdod', 'Ashqelon', 'Bat Yam', 'Beersheba', 'Ben?? Beraq',
    'Bet Shemesh', 'Dimona', 'Eilat', 'El???ad', 'E??? ???aiyiba', 'F??q', 'Givatayim', 'Hadera', 'Haifa', 'Her???liyya', 'Hod HaSharon',
    'Holon', 'Jerusalem', 'Karmiel', 'Kefar Sava', 'Lod', 'Ma???alot Tarsh???????', 'Modi???in Makkabbim Re???ut', 'Nahariyya', 'Nazareth',
    'Nes ???iyyona', 'Netanya', 'Netivot', 'Or Yehuda', 'Peta??? Tiqwa', 'Qiryat Ata', 'Qiryat Bialik', 'Qiryat Gat', 'Qiryat Mo???qin',
    'Qiryat Ono', 'Qiryat Yam', 'Ra???ananna', 'Rahat', 'Ramat Gan', 'Ramat HaSharon', 'Ramla', 'Re???ovot', 'Rishon Le???iyyon',
    'Rosh Ha???Ayin', 'Sakhn??n', 'Tamra', 'Tel Aviv-Yafo', 'Tiberias', 'Umm el Fa???m', 'Yehud', '???efat'];
}
