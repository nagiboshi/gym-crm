import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ProductCategory} from './product-category';

export enum ProductType {
  Membership, Misc
}

@Entity({
  orderBy: {'id': 'ASC'}
})
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: false})
  isShared: boolean;

  @Column({nullable: true})
  numberOfParticipants?: number;

  @Column()
  name: string;

  @Column({nullable: true})
  expirationType: 'day'|'month'|'year';

  @Column({nullable: true})
  expirationLength: number;

  @ManyToOne(type => ProductCategory, pckg => pckg.products)
  productCategory: ProductCategory;

  @Column({nullable: true})
  type: ProductType;
}
