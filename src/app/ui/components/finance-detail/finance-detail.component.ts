import { Component, enableProdMode } from '@angular/core';
import DataSource from 'devextreme/data/data_source';

import { FinanceService } from 'src/app/services/model/finance.service';

import { BaseUrl } from 'src/app/contracts/base_url';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/toastr.services/custom-toastr.service';



if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}
@Component({
  selector: 'app-finance-detail',
  templateUrl: './finance-detail.component.html',
  styleUrls: ['./finance-detail.component.scss']
})
export class FinanceDetailComponent extends BaseComponent {

  currentPageNo: number;
  totalRowCount: number;
  totalPageCount: number;
  baseUrl: BaseUrl;
  pageSize: number = 20;
  pageList: number[] = [];
  suppliersData: DataSource;

  currentPageIndex: number = 0; // Sayfa indeksi
  constructor(private financeService: FinanceService, private activatedRoute: ActivatedRoute, spinner: NgxSpinnerService, private customToastrService: CustomToastrService) {
    super(spinner);
    this.suppliersData = new DataSource({
      store: []
    });

  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(async params => {
      this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating)
      this.currentPageNo = parseInt(params["pageNo"] ?? 1);
      const data = await this.financeService.getInvoice(this.currentPageNo - 1, this.pageSize, (data) => { this.suppliersData = data.invoices }, (message: string) => {
        this.errorMesaj(message)
        debugger
        this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating)
      }).then();
      this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating)
      this.totalRowCount = data.invoiceCount;
      this.totalPageCount = Math.ceil(this.totalRowCount / this.pageSize);
      this.pageList = [];
      if (this.currentPageNo - 3 <= 0)
        for (let i = 1; i <= 7; i++)
          this.pageList.push(i);

      else if (this.currentPageNo + 3 >= this.totalPageCount)
        for (let i = this.totalPageCount - 6; i <= this.totalPageCount; i++)
          this.pageList.push(i);

      else
        for (let i = this.currentPageNo - 3; i <= this.currentPageNo + 3; i++)
          this.pageList.push(i);

      
    }

    )
    

  }


  errorMesaj(error: string) {
    this.customToastrService.message(error, "Hata", { messageType: ToastrMessageType.Error, position: ToastrPosition.TopRight })
  }
}

