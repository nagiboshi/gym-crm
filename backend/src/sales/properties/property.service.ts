import {Inject, Injectable} from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Property} from './property';
import {Repository} from 'typeorm';
import {PropertyValueService} from './property-value/property-value.service';
import {PropertyValue} from './property-value/property-value';

@Injectable()
export class PropertyService extends TypeOrmCrudService<Property> {
  constructor(@InjectRepository(Property) public repo: Repository<Property>, public propertyValueService: PropertyValueService) {
    super(repo);
  }


  saveBatch(properties: Property[]): Promise<Property[]> {
    return Promise.all(properties.map( async (property) => {
      let propertyValues = property.values;
      const savedProperty = await this.repo.save(property);
      propertyValues.forEach( propValue => propValue.property = savedProperty );
      propertyValues = await this.propertyValueService.repo.save(propertyValues);
      savedProperty.values = propertyValues.map<PropertyValue>( p => {return { id: p.id, value: p.value, propertyId: savedProperty.id}});
      return savedProperty;
    }));
  }


}
