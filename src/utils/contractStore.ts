import { Contract } from '@ethersproject/contracts'

export class ContractStore {
  private contractMap = new Map<string, any>()

  public set<T>(address: string, contract: T) {
    this.contractMap.set(address, contract)
  }

  public get<T>(address: string): (T & Contract) | undefined {
    if (this.contractMap.has(address)) {
      return this.contractMap.get(address)
    } else {
      return undefined
    }
  }
}
