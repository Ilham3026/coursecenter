import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-detailproduct',
  templateUrl: './detailproduct.component.html',
  styleUrls: ['./detailproduct.component.scss']
})
export class DetailproductComponent implements OnInit {

  detailCollection:any;
  rate5:number = 5;
  rate4:number = 4;
  rate3:number = 3;
  rate2:number = 2;
  rate1:number = 1;

  productSubscription: any;

  showwladded:boolean   = false;
  showwlremoved:boolean = true;

  constructor(private router: Router, private titleService: Title) { 

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.productSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // You need to tell the router that, you didn't visit or load the page previously, so mark the navigated flag to false as below.
        this.router.navigated = false;
      }
    });

    this.detailCollection = router.getCurrentNavigation()?.extras;
    if(this.detailCollection.id_prod == null || this.detailCollection.id_prod == ''){
      this.router.navigate(['/']);
    }

    let dt_wishlist:any = localStorage.getItem('wishlist');
    let hash_array:any = [];
    if(dt_wishlist == null || dt_wishlist == ''){
      this.showwladded   = false;
      this.showwlremoved = true;
    }else{
      this.showwladded   = false;
      this.showwlremoved = true;
      hash_array = JSON.parse(dt_wishlist);
      for(let x = 0; x <= hash_array.length-1; x++){
        if(hash_array[x].id_prod == this.detailCollection.id_prod){
          this.showwladded   = true;
          this.showwlremoved = false;
        }
      }
    }
    
    this.titleService.setTitle(this.detailCollection.title);

  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  counttotalrating(arr:any){
    let rating = 0;
    rating = arr.onestar + arr.twostar + arr.threestar + arr.fourstar + arr.fivestar;
    return rating;
  }

  procrate(arr:any){
    let rate      = 0;
    let totalnum  = this.counttotalrating(arr);
    let onestar   = arr.onestar * 1;
    let twostar   = arr.twostar * 2;
    let threestar = arr.threestar * 3;
    let fourstar  = arr.fourstar * 4;
    let fivestar  = arr.fivestar * 5;

    if(totalnum == 0){
      rate = 0;
    }else{
      rate = onestar + twostar + threestar + fourstar + fivestar;
      rate = rate/totalnum;
      rate = Math.round(rate * 10) / 10;
    }


    return rate;
  }

  levelcheck(num:number){
    let res = '';
    if(num == 0){
      res = 'Pemula';
    }else if(num == 1){
      res = 'Lanjutan';
    }else if(num == 2){
      res = 'Professional';
    }else if(num == 3){
      res = 'Semua Tingkat';
    }

    return res;
  }

  checkrate(num:number) {
    let res:any = '';
    if(num == 0){
      res = 'No Review Yet';
    }else{
      res = '('+num+')';
    }
    return res;
  }

  addToCart(arr:any) {
    let dt_cart:any = localStorage.getItem('cart');
    let hash_array:any = [];

    if(dt_cart == null || dt_cart == ''){
      hash_array[0]        = arr;
      hash_array[0].jumlah = 1;
      localStorage.setItem('cart', JSON.stringify(hash_array));
    }else{
      hash_array = JSON.parse(dt_cart);
      let indexid = null;

      for(let x = 0; x <= hash_array.length-1; x++){
        if(hash_array[x].id_prod == arr.id_prod){
          indexid = x;
        }
      }

      if(indexid == null){
        hash_array[hash_array.length]          = arr;
        hash_array[hash_array.length-1].jumlah = 1;
        localStorage.setItem('cart', JSON.stringify(hash_array));
      }else{
        hash_array[indexid].jumlah ++;
        localStorage.setItem('cart', JSON.stringify(hash_array));
      }
    }

    this.router.navigate(['/']);
    Swal.fire({
      title: 'Berhasil menambahkan belanja!',
      icon: 'success',
      confirmButtonText: 'Tutup'
    })
  }

  addToWishlist(stats:string, arr:any){
    let dt_wishlist:any = localStorage.getItem('wishlist');
    let hash_array:any  = [];
    let titledesc:string    = '';

    if(dt_wishlist == null || dt_wishlist == ''){
      titledesc = 'Berhasil menambahkan wishlist!';
      hash_array[0] = arr;
      localStorage.setItem('wishlist', JSON.stringify(hash_array));
    }else{
      hash_array = JSON.parse(dt_wishlist);
      if(stats == 'add'){
        titledesc = 'Berhasil menambahkan wishlist!';
        hash_array[hash_array.length] = arr;
        localStorage.setItem('wishlist', JSON.stringify(hash_array));
      }else if(stats == 'remove'){
        for(let x = 0; x <= hash_array.length-1; x++){
          if(hash_array[x].id_prod == arr.id_prod){
            hash_array.splice(x, 1);
            titledesc = 'Berhasil menghapus wishlist!';
          }
        }
        if(hash_array.length == 0){
          localStorage.setItem('wishlist', '');
        }else{
          localStorage.setItem('wishlist', JSON.stringify(hash_array));
        }
      }
    }

    this.router.navigate(['/detailproduct'], arr);
    Swal.fire({
      title: titledesc,
      icon: 'success',
      confirmButtonText: 'Tutup'
    })
  }

}
