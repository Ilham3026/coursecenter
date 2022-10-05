import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title        = 'intproj';
  itemcart:any;
  constructor(private router: Router) {

    if(localStorage.getItem('cart')){
      this.itemcart = localStorage.getItem('cart');
      this.itemcart = JSON.parse(this.itemcart);
    }else{
      this.itemcart = [];
    }

  }
}
