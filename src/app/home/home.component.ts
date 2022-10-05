import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  faStar      = faStar;
  page        = 1;
  statsFilter = 'default';
  jsonURL     = 'assets/data/dummycollection.json';
  dummycollection:any[] = [];
  bakcollection:any[] = [];
  
  constructor(private http: HttpClient, private router: Router, private titleService:Title) {
    
  this.titleService.setTitle("Home - List Course");

    this.getJSON().subscribe(data => {
      this.dummycollection = data;
      this.bakcollection   = data;
    });

    if(localStorage.getItem('cart')){
      let arr:any = localStorage.getItem('cart');
      console.log(JSON.parse(arr));
    }else{
      console.log('no value');
    }

    if(localStorage.getItem('wishlist')){
      let arr:any = localStorage.getItem('wishlist');
      // console.log(JSON.parse(arr));
    }else{
      // console.log('no wish');
    }
    // localStorage.setItem('cart', '');
  }
  
  public getJSON(): Observable<any> {
    return this.http.get(this.jsonURL);
  }

  ngOnInit(): void {
  }

  openprod(arr:any) {
    this.router.navigate(['/detailproduct'], arr);
  }
  
  onTableDataChange(event:any) {
    this.page = event;
  }

  counttotalrating(arr:any){
    let rating = 0;
    rating = arr.onestar + arr.twostar + arr.threestar + arr.fourstar + arr.fivestar;
    return rating;
  }

  promocheck(dtp:number, dt:number){
    if(dtp == 0){
      return dt;
    }else{
      return dtp;
    }
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
  
  sortby(stats:string){
    if(stats == 'price_asc'){
      this.statsFilter = 'dari Harga Termurah';
      this.dummycollection = this.bakcollection.sort( (a, b) => {
        return a.promoprice - b.promoprice;
      });
    }else if(stats == 'price_dsc'){
      this.statsFilter = 'dari Harga Termahal';
      this.dummycollection = this.bakcollection.sort( (a, b) => {
        return b.promoprice - a.promoprice;
      });
    }else if(stats == 'default'){
      this.statsFilter = 'default';
      this.dummycollection = this.bakcollection.sort( (a, b) => {
        return a.id_prod - b.id_prod;
      });
    }else if(stats == 'fivestar'){
      this.statsFilter = 'berdarkan Bintang 5';
      var hash_array:any = [];
      for(let x = 0; x <= this.bakcollection.length-1; x++){
        if(Math.round(this.procrate(this.bakcollection[x].rate)) == 5){
          hash_array.push(this.bakcollection[x]);
        }
      }
      this.dummycollection = hash_array;
    }else if(stats == 'fourstar'){
      this.statsFilter = 'berdarkan Bintang 4';
      var hash_array:any = [];
      for(let x = 0; x <= this.bakcollection.length-1; x++){
        if(Math.round(this.procrate(this.bakcollection[x].rate)) == 4){
          hash_array.push(this.bakcollection[x]);
        }
      }
      this.dummycollection = hash_array;
    }else if(stats == 'threestar'){
      this.statsFilter = 'berdarkan Bintang 3';
      var hash_array:any = [];
      for(let x = 0; x <= this.bakcollection.length-1; x++){
        if(Math.round(this.procrate(this.bakcollection[x].rate)) == 3){
          hash_array.push(this.bakcollection[x]);
        }
      }
      this.dummycollection = hash_array;
    }else if(stats == 'twostar'){
      this.statsFilter = 'berdarkan Bintang 2';
      var hash_array:any = [];
      for(let x = 0; x <= this.bakcollection.length-1; x++){
        if(Math.round(this.procrate(this.bakcollection[x].rate)) == 2){
          hash_array.push(this.bakcollection[x]);
        }
      }
      this.dummycollection = hash_array;
    }else if(stats == 'onestar'){
      this.statsFilter = 'berdarkan Bintang 1';
      var hash_array:any = [];
      for(let x = 0; x <= this.bakcollection.length-1; x++){
        if(Math.round(this.procrate(this.bakcollection[x].rate)) == 1){
          hash_array.push(this.bakcollection[x]);
        }
      }
      this.dummycollection = hash_array;
    }
  }

  procBadgeNew(date:any){
    var today = new Date();
    date      = new Date(date);
    var diffTime = today.getTime() - date.getTime();
    var diffDays = diffTime / (1000 * 3600 * 24) 
    var diff = Math.round(diffDays);

    if(diff <= 7){
      return true;
    }else{
      return false;
    }
  }

  procBadgeBS(review:any, rate:number){
    if(review >= 200 && rate >= 4){
      return true;
    }else{
      return false;
    }
  }

  procBadgeHot(newprod:any, bs:any){
    if(newprod == true && bs == true){
      return true;
    }else{
      return false;
    }
  }

}
