import pytest

from message_queue_new.consumer import get_consumer_callback
from message_queue_new.models import Message


def test_get_consumer_callback_email():
    callback = get_consumer_callback("EMAIL")
    assert callback is not None


def test_get_consumer_callback_invalid_raises():
    with pytest.raises(ValueError):
        get_consumer_callback("UNKNOWN")


def test_notification_send_methods_do_not_raise():
    callback = get_consumer_callback("EMAIL")
    message = Message(order_id="1", user_id="2", content="test", timestamp="2026-03-29T00:00:00Z")
    callback(message)
