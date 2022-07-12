import { MulticalState } from './multicall/reducer'
import { ApplicationState } from './application/reducer'
import { TransictionState } from './transaction/reducer'

interface RootState {
  application: ApplicationState
  multical: MulticalState
  transaction: TransictionState
}
