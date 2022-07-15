import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'strLength'
})
export class StringLengthPipe implements PipeTransform {

  transform(value: string): string {
    let str = value.trim();
    try{
      return str.length > 20 ? `${ str.slice(0, 10) }...${ str.slice(-1) }` : value;
    }catch(err){
      console.error(err);
      return value;
    }
  }

}
