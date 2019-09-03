import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LaunchDarklyService } from '../launchdarkly.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
  providers: [LaunchDarklyService]
})

export class CardsComponent implements OnInit {
  infinite_scroll: boolean;
  infinite_scroll_subscription: any;
  originalCards = [];
  cards = [];
  pageCount = 1;

  // Set the current user to QA 
  users = ["QA", "Developer", "Anonymous", "End-User"]
  user = this.users[0];

  // Subscribe to infinite-scroll flag changes from LaunchDarkly
  constructor(private http: HttpClient, private ld: LaunchDarklyService) {
    this.infinite_scroll = ld.flags['infinite-scroll'];
    this.infinite_scroll_subscription = ld.flagChange.subscribe((flags) => {
      this.infinite_scroll = flags['infinite-scroll'].current;
    });
  }

  // When a new user is selected, change the current user
  changeUser(userKey) {
    this.ld.changeUser(userKey);
  }

  // Initially display the first 20 tech books, regardless of who the current user is
  ngOnInit(): void {
    const books = [];
    this.http.get('http://localhost:3000/books?page=1').subscribe(books => {
      const keys = Object.keys(books);
      try {
        for (var i = 0; i < keys.length; i++) {
          this.cards.push(books[i]);
        }
      }
      catch (err) {
        this.cards = [];
      }
    });
  }

  // If the infinite_scroll feature flag is turned on for the current user,  
  // request more books from the backend and display them
  getMoreBooks() {
    this.pageCount++;
    console.log('Current user: ' + this.ld.ldClient.getUser().key + "; Infinite-scroll feature: " + this.infinite_scroll);
    if (this.infinite_scroll) {
      this.http.get('http://localhost:3000/books?page=' + this.pageCount).subscribe(books => {
        const keys = Object.keys(books);
        try {
          for (var i = 0; i < keys.length; i++) {
            this.cards.push(books[i]);
          }
        }
        catch (err) {
          this.cards = [];
        }
      });
    }
  }
}
