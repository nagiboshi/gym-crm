import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {PropertyService} from '../properties/property.service';
import {InventoryItem} from './inventory-item';

@Injectable()
export class InventoryService extends TypeOrmCrudService<InventoryItem> {
  constructor(@InjectRepository(InventoryItem) public repo: Repository<InventoryItem>, public propertyService: PropertyService) {
    super(repo);
  }



  async saveBatch(items: Array<InventoryItem>){
    // const inventoryItemToProduct = items.forEach( i => i.details);
    let idxToDetails = {};
    for ( let idx=0; idx < items.length; idx++ ) {
      idxToDetails[idx] = items[idx].details;
      items[idx].details = null;
      items[idx] = await this.repo.save(items[idx]);
    }
    let details = [];
    // items.forEach( i => i.details)
  }
}
