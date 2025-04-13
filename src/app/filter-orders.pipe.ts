import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOrders',
  standalone: true,
})
export class FilterOrdersPipe implements PipeTransform {
  transform(orders: any[], statuses: string[]): any[] {
    if (!orders || !statuses) return orders;
    return orders.filter((order) => statuses.includes(order.orderStatus));
  }
}