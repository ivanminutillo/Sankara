import { connect } from 'react-redux'
import Currency from '../components/Currency'
import {updateBalanceAction} from '../core/actions/currency'
import {updateFeedAction, getFeedAction} from '../core/actions/feed'
function mapStateToProps (state) {
  return {
    sbot: state.ssb.sbot,
    name: state.ssb.name,
    id: state.ssb.id,
    feed: state.feed,
    updatedFeed: state.updatedFeed,
    mutual: state.mutual,
    currency: state.currency,
    friends: state.friends
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateBalance: (amount, currency) => {
      dispatch(updateBalanceAction(amount, currency))
    },
    updateFeed: (tx, currency) => {
      dispatch(updateFeedAction(tx, currency))
    },
    getFeed: (feed, currency) => {
      dispatch(getFeedAction(feed, currency))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Currency)
