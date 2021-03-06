import { Component, OnInit } from '@angular/core';
import { UserService } from "@services/user.service";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.page.html',
  styleUrls: ['./article-list.page.scss'],
})
export class ArticleListPage implements OnInit {
  articles: []
  editMode: false;
  currentSearchTerm = '';
  constructor(private userService: UserService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.url.subscribe(() =>
      this.searchArticles());

  }
  searchArticlesByTerm(value) {
    const term = value.detail.value
    this.currentSearchTerm = term;
    this.searchArticles(term);
  }
  searchArticles(content: string = "") {
    this.articles = [];
    this.userService.getUserArticles(content)
      .then((articles) => {

        this.articles = articles;

      }).catch(() => this.articles = []);

  }

  delete(article) {
    article.destroy().finally((this.searchArticles(this.currentSearchTerm)));
  }
}
