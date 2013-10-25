class MessagesController < ApplicationController
  def create
    curr_room = Room.find(params[:message][:room_id])

    new_message = curr_room.messages.create(user: params[:message][:user], content: params[:message][:content])

    unless new_message.errors.any?
      @errors = nil
    else 
      @errors = new_message.errors.full_messages
    end

    respond_to do |format|
      format.html { redirect_to listings_url }
      format.js
    end
  end

  def index
    # assume that the user is connected to the internet the whole time, so only retrieve 50 messages each time.
    curr_room = Room.find(params[:room_id])

    messages = curr_room.messages.order_by("created_at DESC").limit(50)

    # reverse the array so it is ordered from least recent to most recent
    @msg_array = Array.new
    messages.each do |msg| 
      @msg_array.unshift(msg)
    end

    respond_to do |format|
      format.html { redirect_to listings_url }
      format.js
    end

  end
end
