# frozen_string_literal: true

require "test_helper"
require "action_view"
require "keystone_ui/react/mount_helper"

module KeystoneUi
  module React
    class MountHelperTest < Minitest::Test
      include ActionView::Helpers::TagHelper
      include KeystoneUi::React::MountHelper

      def test_mounting_names_the_ui_to_draw
        assert_includes react_ui("alembic/page-builder"), 'data-react-ui="alembic/page-builder"'
      end
    end
  end
end
