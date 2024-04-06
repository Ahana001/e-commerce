// import { CHANNEL, RabbitMQIncommingMessageProduct, sendMessage } from "../../utilities/rabbitmq_manager";
import {  getProdcutByName } from "./models";
import { IProduct } from "./type";

export async function CheckDuplicateName(
  product: IProduct
): Promise<boolean> {
  const products = await getProdcutByName(
    product.name
  );
  if (products && products.length) {
      return true;
  }
  return false;
}

// export async function processProductStockInquiry(
//   data: RabbitMQIncommingMessageProduct['data']
// ) {
//   const products = await getProdcutByIds(data.product_ids);
//   await sendMessage(
//     CHANNEL.OUTPUT_QUEUE,
//     {
//       event: 'ORDER',
//       action: 'NEW_ORDER',
//       data: {
//         products: products
//       },
//     },
//   );

// }