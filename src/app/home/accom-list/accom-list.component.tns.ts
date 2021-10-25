import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { SearchService } from '@src/app/service/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-accom-list',
  templateUrl: './accom-list.component.tns.html',
  styleUrls: ['./accom-list.component.tns.scss']
})
export class AccomListComponent implements OnInit, OnDestroy {

    subscription: Array<Subscription> = [];
    lastDelY = 0;
    headerCollapsed = false;
    selectedTab = 0;
    selectedTabview = 0;
    items: Array<any>;
    categories: Array<any>;

    constructor(
        private routerExtensions: RouterExtensions,
        private searchService: SearchService
    ) {

        //Set up to get data from shared service to help moving from mocking data to real API calls in the future
        this.items = [{
          id: 1,
          name: "Manila Ultimate Tombstone Burger",
          cover: "~/assets/images/thumb/thumb2.png",
          images: [
            "~/assets/images/no_image.png",
            "~/assets/images/no_image.png",
            "~/assets/images/no_image.png",
            "~/assets/images/thumb/thumb1.png"
            ],
          category: "Burger",
          categoryTag: "#2D9CDB",
          price: "300.00",
          likes: 987,
          isLike: false,
          isFavorite: true,
          comments: 13,
          rating: "4.5",
          description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione maiores, veritatis nesciunt sint dolorum sequi dicta omnis dolor blanditiis, ipsam officiis commodi temporibus quas non nobis tempore saepe necessitatibus quasi! Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      \nRatione maiores, veritatis nesciunt sint dolorum sequi dicta omnis dolor blanditiis, ipsam officiis commodi temporibus quas non nobis tempore saepe necessitatibus quasi! Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      \nNesciunt sint dolorum sequi dicta omnis dolor blanditiis, ipsam officiis commodi temporibus quas non nobis tempore saepe necessitatibus quasi!
      \nRatione maiores, veritatis nesciunt sint dolorum sequi dicta omnis dolor blanditiis, ipsam officiis commodi temporibus quas non nobis tempore saepe necessitatibus quasi! Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      \nNesciunt sint dolorum sequi dicta omnis dolor blanditiis, ipsam officiis commodi temporibus quas non nobis tempore saepe necessitatibus quasi!`
      },
      {
          id: 2,
          name: "Quezon Chocolate Marble Pancake",
          cover: "~/assets/images/thumb/thumb2.png",
          images: [
            "~/assets/images/no_image.png",
            "~/assets/images/no_image.png",
            "~/assets/images/no_image.png",
            "~/assets/images/thumb/thumb1.png"
        ],
          category: "Pancake",
          categoryTag: "#e4ce0d",
          price: "230.00",
          likes: 891,
          isLike: true,
          isFavorite: true,
          comments: 7,
          rating: "4.0",
          description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione maiores, veritatis nesciunt sint dolorum sequi dicta omnis dolor blanditiis, ipsam officiis commodi temporibus quas non nobis tempore saepe necessitatibus quasi! Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      \nRatione maiores, veritatis nesciunt sint dolorum sequi dicta omnis dolor blanditiis, ipsam officiis commodi temporibus quas non nobis tempore saepe necessitatibus quasi! Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      \nNesciunt sint dolorum sequi dicta omnis dolor blanditiis, ipsam officiis commodi temporibus quas non nobis tempore saepe necessitatibus quasi!
      \nRatione maiores, veritatis nesciunt sint dolorum sequi dicta omnis dolor blanditiis, ipsam officiis commodi temporibus quas non nobis tempore saepe necessitatibus quasi! Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      \nNesciunt sint dolorum sequi dicta omnis dolor blanditiis, ipsam officiis commodi temporibus quas non nobis tempore saepe necessitatibus quasi!`
      },
      {
          id: 3,
          name: "Binondo Black Forest Cake",
          cover: "~/assets/images/thumb/thumb2.png",
          images: [
              "~/assets/images/no_image.png",
              "~/assets/images/no_image.png",
              "~/assets/images/no_image.png",
              "~/assets/images/thumb/thumb1.png"
          ],
          category: "Cake",
          categoryTag: "#27AE60",
          price: "300.00",
          likes: 730,
          isLike: true,
          isFavorite: true,
          comments: 11,
          rating: "4.0",
          description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione maiores, veritatis nesciunt sint dolorum sequi dicta omnis dolor blanditiis, ipsam officiis commodi temporibus quas non nobis tempore saepe necessitatibus quasi! Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      \nRatione maiores, veritatis nesciunt sint dolorum sequi dicta omnis dolor blanditiis, ipsam officiis commodi temporibus quas non nobis tempore saepe necessitatibus quasi! Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      \nNesciunt sint dolorum sequi dicta omnis dolor blanditiis, ipsam officiis commodi temporibus quas non nobis tempore saepe necessitatibus quasi!
      \nRatione maiores, veritatis nesciunt sint dolorum sequi dicta omnis dolor blanditiis, ipsam officiis commodi temporibus quas non nobis tempore saepe necessitatibus quasi! Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      \nNesciunt sint dolorum sequi dicta omnis dolor blanditiis, ipsam officiis commodi temporibus quas non nobis tempore saepe necessitatibus quasi!`
      }];
        this.categories = [
          {
              cover: "~/assets/images/food/burger640.jpg",
              category: "BURGER",
              count: "13",
          },
          {
              cover: "~/assets/images/food/pancake640.jpg",
              category: "PANCAKE",
              count: "5",
          },
          {
              cover: "~/assets/images/food/cake640.jpg",
              category: "CAKE",
              count: "9",
          },
          {
              cover: "~/assets/images/food/beer640.jpg",
              category: "BEER",
              count: "7",
          }
      ];;
    }

    ngOnInit(): void {
        console.log(this.searchService.srch);
    }

    ngOnDestroy(){
        this.subscription.forEach(a=> {
            console.log(a);
            a.unsubscribe();
        });
    }

    showItem(itemId) {
        console.log(`Tapped on ${itemId}`);
        this.routerExtensions.navigate(["detail/" + itemId, {
            animated: true,
            transition: {
                name: "slideTop",
                duration: 380,
                curve: "easeIn"
            }
        }]);
    }

    toggleLike(item) {
        item.isLike = !item.isLike;
        if (item.isLike) {
            item.likes += 1;
        } else {
            item.likes -= 1;
        }
    }

    toggleHeart(item) {
        item.isFavorite = !item.isFavorite;
    }

    categoryIcon(itemCategory) {
        switch (itemCategory) {
            case "Burger":
                return String.fromCharCode(0xf0f5); //"fa-cutlery";
                break;
            case "Beer":
                return String.fromCharCode(0xf0fc); //"fa-beer";
                break;
            case "Pancake":
                return String.fromCharCode(0xf0f4); //"fa-coffee";
                break;
            case "Cake":
                return String.fromCharCode(0xf1fd); //"fa-birthday-cake";
                break;
            default:
                return String.fromCharCode(0xf06d); //"fa-fire";
                break;
        }
    }


    //Top nav bar tap methods
    onBellTap() {
    }

    onSearchTap() {
    }

    onPopularTap() {
        this.selectedTabview = 0;
    }

    onCategoryTap() {
        this.selectedTabview = 1;
    }

    onPromosTap() {
        this.selectedTabview = 2;
    }

    //Bottom nav bar tap methods
    onHomeTap() {
        this.selectedTab = 0;
    }

    onCartTap() {
        this.selectedTab = 1;
    }

    onHistoryTap() {
        this.selectedTab = 2;
    }

    onAboutTap() {
        this.selectedTab = 3;
    }

    onBottomNavTap(url: string): void {
    }
}
