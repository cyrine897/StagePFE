import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-welcomepage',
  templateUrl: './welcomepage.component.html',
  styleUrls: ['./welcomepage.component.css']
})
export class WelcomepageComponent {

  constructor(private route: ActivatedRoute) {}
  message: string='';

  ngOnInit() {
    // Retrieve the message from the query parameters
    this.route.queryParams.subscribe(params => {
      this.message = params['message'];
    });
  }
}
