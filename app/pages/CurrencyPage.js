import { connect } from 'react-redux'
import Currency from '../components/Currency'
import {updateBalanceAction} from '../core/actions/currency'
import {updateFeedAction} from '../core/actions/feed'
function mapStateToProps (state) {
  return {
    sbot: state.ssb.sbot,
    name: state.ssb.name,
    id: state.ssb.id,
    feed: state.feed,
    updatedFeed: state.updatedFeed,
    mutual: state.mutual,
    currency: state.currency
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateBalance: (amount) => {
      dispatch(updateBalanceAction(amount))
    },
    updateFeed: (feed) => {
      dispatch(updateFeedAction(feed))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Currency)
