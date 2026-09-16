# frozen_string_literal: true

require "test_helper"
require "action_view"
require "keystone_ui/react/mount_helper"

module KeystoneUi
  module React
    class MountHelperTest < Minitest::Test
      include ActionView::Helpers::TagHelper
      include KeystoneUi::React::MountHelper

      def test_naming_the_react_ui_to_mount
        assert_includes react_ui("test/greeting"), 'data-react-ui="test/greeting"'
      end

      def test_giving_the_react_ui_its_props_as_json
        assert_includes react_ui("test/greeting", { name: "Ada" }), 'data-props="{&quot;name&quot;:&quot;Ada&quot;}"'
      end

      def test_keeping_the_other_attributes_the_page_gives_the_element
        mounted = react_ui("test/greeting", {}, class: "flex-1", data: { flow_canvas: true })

        assert_includes mounted, 'class="flex-1"'
        assert_includes mounted, "data-flow-canvas"
      end
    end
  end
end
