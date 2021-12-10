import { Currency, Price, Token } from 'plugins/@uniswap/sdk-core'
import { Pool } from './pool'
/**
 * Represents a list of pools through which a swap can occur
 */
export declare class Route<TInput extends Currency, TOutput extends Currency> {
  readonly pools: Pool[]
  readonly tokenPath: Token[]
  readonly input: TInput
  readonly output: TOutput
  private _midPrice
  constructor(pools: Pool[], input: TInput, output: TOutput)
  get chainId(): number
  /**
   * Returns the mid price of the route
   */
  get midPrice(): Price<TInput, TOutput>
}
