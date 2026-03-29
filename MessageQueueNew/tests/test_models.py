import pytest

from message_queue_new.models import Message


def test_message_valid_data():
    message = Message(order_id="123", user_id="abc", content="hi", timestamp="2026-03-29T00:00:00Z")
    assert message.order_id == "123"
    assert message.content == "hi"


def test_message_empty_content_raises_error():
    with pytest.raises(ValueError):
        Message(order_id="123", user_id="abc", content="", timestamp="2026-03-29T00:00:00Z")
