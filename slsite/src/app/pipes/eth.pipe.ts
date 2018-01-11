import { Pipe, PipeTransform } from '@angular/core';
import BigNumber = require('bignumber.js');
import { fromWei } from 'web3-utils';
import { Web3Service} from '../services/web3.service';

@Pipe({name : "ethval"})
export class EthValuePipe implements PipeTransform {
    constructor(private web3:Web3Service) {

    }
    transform(value: string, unit:string, frac: number) {
        if(value === undefined) value ='0';
        let fstrVal = fromWei(value,unit);
        let fbnVal = new BigNumber(fstrVal);
        let strVal = fbnVal.toFormat(frac);
        return strVal;
    }
}