import { formatNumber } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  page = 1;
  collection:any[] = [];
  cartSubscription:any;

  constructor(private router: Router, private titleService: Title, @Inject(LOCALE_ID) public locale: string) {

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.cartSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });

    if(localStorage.getItem('cart')){
      let arr:any = localStorage.getItem('cart');
      let collection:any = JSON.parse(arr);

      this.collection = collection;
      this.titleService.setTitle(collection.length + ' Keranjang belanja');
    }else{
      this.titleService.setTitle('Tidak ada belanjaan');
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    
    if(this.collection.length == 0){
      localStorage.setItem('cart', '');
    }else{
      localStorage.setItem('cart', JSON.stringify(this.collection));
    }
  }
  
  onTableDataChange(event:any) {
    this.page = event;
  }

  removeDuplicates(arr:any) {
    return arr.filter((value:any, index:any, self:any) =>
    index === self.findIndex((t:any) => (
    t.id_prod === value.id_prod
  )) )
  }

  openprod(arr:any) {
    Swal.fire({
      title: 'Apakah anda yakin ingin meninggalkan halaman keranjang?',
      showCancelButton: true,
      cancelButtonText: 'Batal',
      confirmButtonText: 'Yakin!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/detailproduct'], arr);
      } else {}
    })
  }

  preventClicked(event:any){
    event.stopPropagation();
  }

  promoCheck(promo:number, price:number){
    let showprice = 0;
    if(promo == 0){
      showprice = price;
    }else{
      showprice = promo;
    }
    return showprice;
  }

  countTotal(price:number, entity:number){
    return price * entity;
  }

  pay(){
    let totalprice = 0;
    for(let x = 0; x <= this.collection.length-1; x++){
      let price  = this.promoCheck(this.collection[x].promoprice, this.collection[x].price) * this.collection[x].jumlah;
      totalprice = totalprice + price;
    }
    Swal.fire({
      icon: 'info',
      title: 'Pastikan seluruh belanjaan anda sesuai!',
      showCancelButton: true,
      text: 'Total harga seluruh course: Rp'+ formatNumber(totalprice, this.locale),
      cancelButtonText: 'Batal',
      confirmButtonText: 'Bayar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.collection = [];
        localStorage.setItem('cart','');
        this.router.navigate(['/']);
        Swal.fire('Pembayaran berhasil!', '', 'success')
      } else {}
    })
  }

  click(stats:string, arr:any){
    for(let x = 0; x <= this.collection.length-1; x++){
      if(this.collection[x].id_prod == arr.id_prod){
        if(stats == 'add'){
          this.collection[x].jumlah += 1;
        }else if(stats == 'remove'){
          if(this.collection[x].jumlah <= 1){
            Swal.fire({
              title: 'Apakah anda yakin ingin menghapus item ini dari keranjang?',
              showCancelButton: true,
              cancelButtonText: 'Batal',
              confirmButtonText: 'Yakin!',
            }).then((result) => {
              if (result.isConfirmed) {
                this.collection.splice(x,1);
                if(this.collection.length == 0){
                  this.router.navigate(['/']);
                }else{
                  this.router.navigate(['/cart']);
                }
                Swal.fire('Produk berhasil di hapus dari keranjang!', '', 'success')
              } else {}
            })
          }else{
            this.collection[x].jumlah -= 1;
          }
        }
      }
    }
  }

}
