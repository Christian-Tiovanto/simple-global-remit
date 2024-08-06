import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryColumn({ length: 3, unique: true })
  currency_signature: string;

  @Column()
  currency_name: string;

  @Column({ type: 'numeric' })
  conversion_rate_to_idr: number;
}
