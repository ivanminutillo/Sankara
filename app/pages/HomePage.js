import { connect } from 'react-redux'
import Home from '../components/Home'

function mapStateToProps (state) {
  return {
    sbot: state.ssb.sbot,
    name: state.ssb.name,
    id: state.ssb.id,
    userFeed: state.userFeed,
    mutual: state.mutual
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
