import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
 //les methodes de pagination 
 @Input() totalPages: number = 0;
 @Input() currentPage: number = 0;
 @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

 nextPage() {
   if (this.currentPage < this.totalPages - 1) {
     this.currentPage++;
     this.pageChange.emit(this.currentPage);
   }
 }

 previousPage() {
   if (this.currentPage > 0) {
     this.currentPage--;
     this.pageChange.emit(this.currentPage);
   }
 }


 

}
