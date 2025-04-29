import { Component } from '@angular/core';
import { MedecinService } from 'src/app/Services/medecin.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {
 constructor( private medecinService: MedecinService){}
 verifyMedecin(idUser: number): void {
  this.medecinService.verifyMedecin(idUser).subscribe(
    response => {
      console.log('Medecin verified successfully!', response);
      // Handle successful verification
    },
    error => {
      console.error('Error verifying medecin!', error);
      // Handle error
    }
  );
}
ngAfterViewInit(): void {
 
  this.createDoughnutChart();
  this.createChartBuble();
}
createChartBuble(): void {
  const data = {
    labels: [
      'Red',
      'Blue',
      'Yellow'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [
        { x: 20, y: 30, r: 15 },
        { x: 40, y: 10, r: 10 },
        { x: 25, y: 50, r: 5 }
      ],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

  const ctx = document.getElementById('myChartBuble') as HTMLCanvasElement;
  new Chart(ctx, {
    type: 'bubble',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Bubble Chart'
        }
      }
    }
  });
}
createDoughnutChart(): void {
  const data = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

  const ctx = document.getElementById('doughnutChart') as HTMLCanvasElement;
  new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Doughnut Chart'
        }
      }
    }
  });
}

}
